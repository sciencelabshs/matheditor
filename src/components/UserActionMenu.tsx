"use client"
import * as React from 'react';
import { CheckHandleResponse, User } from '@/types';
import { useDispatch, actions } from '@/store';
import { useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useFixedBodyScroll from '@/hooks/useFixedBodyScroll';
import { debounce } from '@mui/material/utils'
import { IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { validate } from 'uuid';

function UserActionMenu({ user }: { user: User }): JSX.Element {
  const dispatch = useDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const pathname = usePathname();

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };

  const checkHandle = useCallback(debounce(async (resolve: (value: boolean) => void, value?: string) => {
    if (!value) return resolve(true);
    if (!navigator.onLine) return resolve(true);
    if (value === user?.handle) return resolve(true);
    try {
      const response = await fetch(`/api/users/check?handle=${value}`);
      const { data, error } = await response.json() as CheckHandleResponse;
      if (error) return resolve(false);
      return resolve(!!data);
    } catch (err) { return resolve(false) }
  }, 500), [user]);

  const validationSchema = yup.object({
    handle: yup
      .string()
      .min(3, 'Handle must be at least 3 characters')
      .strict().lowercase('Handle must be lowercase')
      .test('is-uuid', 'Handle cannot be a UUID', value => !value || !validate(value))
      .matches(/^[a-zA-Z0-9-]*$/, 'Handle must only contain letters, numbers, and dashes')
      .test('is-online', 'Cannot change handle while offline', value => !value || value === user.handle || navigator.onLine)
      .test('is-unique', 'Handle is already taken', value => new Promise(resolve => checkHandle(resolve, value)))
  });

  const formik = useFormik({
    initialValues: {
      handle: user?.handle || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      closeEditDialog();
      const shouldNavigate = pathname === `/user/${user.handle || user.id}`;
      const partial: Partial<User> = {};
      if (values.handle !== user.handle) partial.handle = values.handle || null;
      if (Object.keys(partial).length === 0) return;
      const result = await dispatch(actions.updateUser({ id: user.id, partial }));
      if (result.type === actions.updateUser.fulfilled.type) {
        if (shouldNavigate) navigate(`/user/${values.handle || user.id}`);
      }
    },
  });

  useFixedBodyScroll(editDialogOpen);

  return (
    <>
      <IconButton
        id="user-action-button"
        aria-label='User Actions'
        onClick={openEditDialog}
        size="small"
      >
        <Settings />
      </IconButton>
      <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="xs">
        <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" spellCheck="false">
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent sx={{ "& .MuiFormHelperText-root": { overflow: "hidden", textOverflow: "ellipsis" } }}>
            <TextField margin="normal" size="small" fullWidth
              id="handle"
              label="User Handle"
              name="handle"
              autoFocus
              value={formik.values.handle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.errors.handle}
              helperText={formik.errors.handle ?? `https://matheditor.me/user/${formik.values.handle || user.id}`}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button type='submit'>Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default UserActionMenu;