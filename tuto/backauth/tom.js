import { default as axios } from "axios";
import { default as axiosRetry } from "axios-retry";
import { refresh } from "react-native-app-auth";

declare var global: any;

/**
  TODO: Proxy the oauth flow for production once we get an API key
  https://docs.aws.amazon.com/fr_fr/apigateway/latest/developerguide/api-gateway-create-api-step-by-step.html
*/

const oauthConfig = {
  issuer: 'https://api.intra.42.fr/',
  clientId: 'a5ef5e53704a2c935d3af0070da1d09ca663d47a247dc3f1537c0c9cefd7f69f',
  clientSecret: '5ee00594a1abfac641fcf73b7d0468310811595dcc0ff6aee9b7949772444866',
  redirectUrl: '',//'us.my42://oauth2callback',
  grantType: 'authorization_code',
  scopes: ['public', 'profile', 'projects'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.intra.42.fr/oauth/authorize',
    tokenEndpoint: 'https://api.intra.42.fr/oauth/token',
    revocationEndpoint: 'https://api.intra.42.fr/oauth/revoke'
  }
};

export default class Api {

  static getConfig()
  {
    return {
      headers: { Authorization: `Bearer ${global.user.auth.accessToken}` }
    };
  }

  static setupRetry()
  {
    axiosRetry(axios, {
      retries: 20, // number of retries, high number since we can do many requests for now :/
      retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 300; // time interval between retries, increments by 300ms every cycle
      },
      retryCondition: (error) => {
        if (error.response)
          return error.response!.status === 429;
        return true;
      },
    });
  }

  static get(endpoint: string)
  {
    let expiration = new Date(global.user.auth.accessTokenExpirationDate);
    if (new Date().getTime() >= (expiration.getTime() - 1000 * 60))
    {
      return refresh(oauthConfig, {
        refreshToken: global.user.auth.refreshToken,
      }).then((result) => {
        global.user.auth = result;
        global.user.saveData();

        return axios.get(
          'https://api.intra.42.fr/v2/' + endpoint,
          this.getConfig()
        );
      })
    }

    return axios.get(
      'https://api.intra.42.fr/v2/' + endpoint,
      this.getConfig()
    );
  }
}

Api.setupRetry();

export {oauthConfig};