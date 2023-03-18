import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth-options';

export const getServerSideSession = async (
  ctx:
    | {
        req: GetServerSidePropsContext['req'];
        res: GetServerSidePropsContext['res'];
      }
    | {
        req: NextApiRequest;
        res: NextApiResponse;
      }
) => {
  return await getServerSession(ctx.req, ctx.res, authOptions);
};
