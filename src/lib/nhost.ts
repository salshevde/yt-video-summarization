import { NhostClient } from '@nhost/react';

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN , // Get Nhost subdomain from env
  region: import.meta.env.VITE_NHOST_REGION // Get Nhost region from env
});
