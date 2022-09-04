import { getAuthenticator, setAuthenticator } from '~/services/auth.server';
import links from '~/utils/links';
import { env } from '~/utils/env.server';

import type { ActionFunction } from '@remix-run/node';


export const action: ActionFunction = async({
  request,
}) => {
  const { rememberMe } = Object.fromEntries(await request.clone().formData());
  setAuthenticator({ maxAge: rememberMe ? undefined : env.SESSION_MAX_AGE });
  return await getAuthenticator().authenticate('user-pass', request, {
    successRedirect: links.auth,
    failureRedirect: links.home,
  });
};
