export const auth0_client_id = 'eWz-5BUDVYEtr-jnCBsMlsXMc8aBi2NV';
export const authorize_url = 'https://rapportera.eu.auth0.com/authorize';
export const logout_url = 'https://rapportera.eu.auth0.com/v2/logout';

export let redirect_uri

if (Expo.Constants.manifest.xde) {
  redirect_uri = 'exp://gj-83j.sonberg.rapportera.exp.direct/+/redirect'
} else {
  redirect_uri = `${Expo.Constants.linkingUri}/redirect`
}
