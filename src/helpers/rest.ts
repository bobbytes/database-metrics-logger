import request from 'request';

type TOptions = request.UrlOptions & request.CoreOptions;

enum RequestMethodEnum {
  Get = 'GET',
  Post = 'POST',
}

interface IRestConfig {
  host: string;
  query?: {};
}

export class Rest {
  private globalOptions: TOptions;

  constructor(config: IRestConfig) {
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
    };

    this.globalOptions = {
      url: config.host,
      headers,
      qs: config.query,
    };
  }

  public get<T>(url: string, query?: {}): Promise<T> {
    const getOptions = {
      ...this.globalOptions,
      method: RequestMethodEnum.Get,
    };

    return this.sendRequest<T>(url, getOptions, query);
  }

  public post<T>(url: string, body: string, query?: {}): Promise<T> {
    const postOptions = {
      ...this.globalOptions,
      method: RequestMethodEnum.Post,
      body,
    };

    return this.sendRequest<T>(url, postOptions, query);
  }

  private sendRequest<T>(url: string, options: TOptions, query?: {}): Promise<T> {
    const requestOptions = {
      ...options,
      qs: { ...this.globalOptions.qs, ...query },
      url: `${this.globalOptions.url}${url}`,
    };

    return new Promise<T>((resolve, reject) => {
      request(requestOptions, (error: any, response: request.Response, body: T) => {
        if (!error && response.statusCode === 200) {
          resolve(this.parseResponseBody(body));
        } else {
          reject(error);
        }
      });
    });
  }

  private parseResponseBody(response: any): any {
    let parsedResponse;

    if (typeof response === 'string') {
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        parsedResponse = response;
      }
    }

    return parsedResponse || response;
  }
}
