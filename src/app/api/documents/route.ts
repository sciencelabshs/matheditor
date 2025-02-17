import { authOptions } from "@/lib/auth";
import { createDocument, findDocumentsByAuthorId, findPublishedDocuments, findUserDocument } from "@/repositories/document";
import { EditorDocument, GetDocumentsResponse, PostDocumentsResponse } from "@/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";

export async function GET() {
  const response: GetDocumentsResponse = {};
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      const publishedDocuments = await findPublishedDocuments();
      response.data = publishedDocuments;
      return NextResponse.json(response, { status: 200 })
    }
    const { user } = session;
    if (user.disabled) {
      response.error = "Account is disabled for violating terms of service";
      return NextResponse.json(response, { status: 403 })
    }
    const documents = await findDocumentsByAuthorId(user.id);
    response.data = documents;
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log(error);
    response.error = "something went wrong";
    return NextResponse.json(response, { status: 500 })
  }

}

export async function POST(request: Request) {
  const response: PostDocumentsResponse = {};
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      response.error = "Not authenticated, please login"
      return NextResponse.json(response, { status: 401 })
    }
    const { user } = session;
    if (user.disabled) {
      response.error = "Account is disabled for violating terms of service";
      return NextResponse.json(response, { status: 403 })
    }
    const body = await request.json() as EditorDocument;
    if (!body) {
      response.error = "Bad input"
      return NextResponse.json(response, { status: 400 })
    }

    const userDocument = await findUserDocument(body.id);
    if (userDocument) {
      response.error = "You don't have permission to edit this document";
      return NextResponse.json(response, { status: 403 })
    }

    const input: Prisma.DocumentUncheckedCreateInput = {
      id: body.id,
      authorId: user.id,
      name: body.name,
      baseId: body.baseId,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      handle: body.handle,
      head: body.head,
      revisions: {
        create: {
          id: body.head || undefined,
          data: body.data as unknown as Prisma.JsonObject,
          authorId: user.id,
          createdAt: body.updatedAt,
        }
      }
    };

    response.data = await createDocument(input);
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log(error);
    response.error = "Something went wrong";
    return NextResponse.json(response, { status: 500 })
  }
}
