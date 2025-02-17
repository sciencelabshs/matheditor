"use client"
import { CloudDocument, User } from '@/types';
import { Avatar, Box, Chip, Fab, IconButton, Typography, useScrollTrigger } from '@mui/material';
import { Edit, FileCopy, Print } from '@mui/icons-material';
import RouterLink from "next/link";
import ShareDocument from './DocumentActions/Share';
import DownloadDocument from './DocumentActions/Download';
import ForkDocument from './DocumentActions/Fork';
import { Transition } from 'react-transition-group';
import AppDrawer from './AppDrawer';

export default function EditDocumentInfo({ cloudDocument, user }: { cloudDocument: CloudDocument, user?: User }) {
  const slideTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handle = cloudDocument.handle || cloudDocument.id;
  const isAuthor = cloudDocument.author.id === user?.id;
  const isCoauthor = cloudDocument.coauthors.some(u => u.id === user?.id);
  const showFork = cloudDocument.published || isAuthor || isCoauthor;
  const userDocument = { id: cloudDocument.id, cloud: cloudDocument };

  return (
    <>
      <AppDrawer title="Document Info">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "start", justifyContent: "start", gap: 1, my: 3 }}>
          <Typography component="h2" variant="h6">{cloudDocument.name}</Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Last Updated: {new Date(cloudDocument.updatedAt).toLocaleDateString()}</Typography>
          <Typography variant="subtitle2">Author <Chip clickable component={RouterLink} prefetch={false}
            href={`/user/${cloudDocument.author.handle || cloudDocument.author.id}`}
            avatar={<Avatar alt={cloudDocument.author.name} src={cloudDocument.author.image || undefined} />}
            label={cloudDocument.author.name}
            variant="outlined"
          />
          </Typography>
          {cloudDocument.coauthors.length > 0 && <>
            <Typography component="h3" variant="subtitle2">Coauthors</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {cloudDocument.coauthors.map(coauthor => (
                <Chip clickable component={RouterLink} prefetch={false}
                  href={`/user/${coauthor.handle || coauthor.id}`}
                  key={coauthor.id}
                  avatar={<Avatar alt={coauthor.name} src={coauthor.image || undefined} />}
                  label={coauthor.name}
                  variant="outlined"
                />
              ))}
            </Box>
          </>}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, alignSelf: "flex-end" }}>
            <IconButton aria-label="Print" color="inherit" onClick={() => { window.print(); }}><Print /></IconButton>
            <ShareDocument userDocument={userDocument} />
            {showFork && <ForkDocument userDocument={userDocument} />}
            {(isAuthor || isCoauthor) && <DownloadDocument userDocument={userDocument} />}
            {(isAuthor || isCoauthor) && <IconButton component={RouterLink} prefetch={false} href={`/edit/${handle}`} aria-label="Edit"><Edit /></IconButton>}
          </Box>
        </Box>
      </AppDrawer>
      {showFork && <Transition in={slideTrigger} timeout={225}>
        <Fab variant="extended" size='medium' component={RouterLink} prefetch={false} href={`/new/${handle}`}
          sx={{ position: 'fixed', right: slideTrigger ? 64 : 24, bottom: 16, px: 2, displayPrint: 'none', transition: `right 225ms ease-in-out` }}>
          <FileCopy sx={{ mr: 1 }} />Fork
        </Fab>
      </Transition>}
    </>
  );
}