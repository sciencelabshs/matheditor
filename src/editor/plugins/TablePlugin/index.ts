"use client"
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  HTMLTableElementWithWithTableSelectionState,
  InsertTableCommandPayload,
  TableSelection,
} from '../../nodes/TableNode';
import type {
  NodeKey,
} from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTableNodeWithDimensions,
  $isTableNode,
  applyTableHandlers,
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '../../nodes/TableNode';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  $getNodeByKey,
  $isTextNode,
  $nodesOfType,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { useEffect } from 'react';
import invariant from '../../shared/invariant';

export function TablePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
      invariant(
        false,
        'TablePlugin: TableNode, TableCellNode or TableRowNode not registered on editor',
      );
    }

    return editor.registerCommand<InsertTableCommandPayload>(
      INSERT_TABLE_COMMAND,
      ({ columns, rows, includeHeaders }) => {
        const tableNode = $createTableNodeWithDimensions(
          Number(rows),
          Number(columns),
          includeHeaders,
        );
        $insertNodeToNearestRoot(tableNode);

        const firstDescendant = tableNode.getFirstDescendant();
        if ($isTextNode(firstDescendant)) {
          firstDescendant.select();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    const tableSelections = new Map<NodeKey, TableSelection>();

    const initializeTableNode = (tableNode: TableNode) => {
      const nodeKey = tableNode.getKey();
      const tableElement = editor.getElementByKey(
        nodeKey,
      ) as HTMLTableElementWithWithTableSelectionState;
      if (tableElement && !tableSelections.has(nodeKey)) {
        const tableSelection = applyTableHandlers(
          tableNode,
          tableElement,
          editor,
        );
        tableSelections.set(nodeKey, tableSelection);
      }
    };

    // Plugins might be loaded _after_ initial content is set, hence existing table nodes
    // won't be initialized from mutation[create] listener. Instead doing it here,
    editor.getEditorState().read(() => {
      const tableNodes = $nodesOfType(TableNode);
      for (const tableNode of tableNodes) {
        if ($isTableNode(tableNode)) {
          initializeTableNode(tableNode);
        }
      }
    });

    const unregisterMutationListener = editor.registerMutationListener(
      TableNode,
      (nodeMutations) => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === 'created') {
            editor.getEditorState().read(() => {
              const tableNode = $getNodeByKey<TableNode>(nodeKey);
              if ($isTableNode(tableNode)) {
                initializeTableNode(tableNode);
              }
            });
          } else if (mutation === 'destroyed') {
            const tableSelection = tableSelections.get(nodeKey);

            if (tableSelection !== undefined) {
              tableSelection.removeListeners();
              tableSelections.delete(nodeKey);
            }
          }
        }
      },
    );

    return () => {
      unregisterMutationListener();
      // Hook might be called multiple times so cleaning up tables listeners as well,
      // as it'll be reinitialized during recurring call
      for (const [, tableSelection] of tableSelections) {
        tableSelection.removeListeners();
      }
    };
  }, [editor]);

  return null;
}
