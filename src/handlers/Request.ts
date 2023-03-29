import Axios, { AxiosRequestConfig } from 'axios';

type ApiKeyAuth = {
  ApiKey: string;
};

export interface RequestConfigOptions {
  authType: 'Bearer' | ApiKeyAuth;
  getRequestToken(): Promise<string>;
}

export class Request {
  private configOptions: RequestConfigOptions;

  constructor(configOptions: RequestConfigOptions) {
    this.configOptions = configOptions;
  }

  static config(configOptions: RequestConfigOptions): Request {
    return new Request(configOptions);
  }
  /**
   * Prepares request options
   *
   * @param axiosOpts
   * @param token
   */
  private prepareRequest(axiosOpts: AxiosRequestConfig, token: string): Object {
    const { authType } = this.configOptions;
    /* eslint-disable-next-line */
    const { url, method, headers = {}, data, ...requestOptions } = axiosOpts || {};
    const headerAuth =
      authType === 'Bearer' ? { Authorization: `Bearer ${token}` } : 'ApiKey' in authType ? { [authType.ApiKey]: token } : {};

    const options: AxiosRequestConfig = {
      ...requestOptions,
      headers: {
        ...headers,
        ...headerAuth,
      },
    };

    return { data, ...options };
  }
  /**
   * Makes a GET request
   *
   * @param endpoint
   * @param options
   */
  async get<T>(endpoint: string, options?: AxiosRequestConfig | null): Promise<T> {
    return (await Axios.get(endpoint, options || {})).data as T;
  }
  /**
   * Makes a POST request
   *
   * @param endpoint
   * @param data
   * @param options
   */
  async post<T>(endpoint: string, options?: AxiosRequestConfig | null): Promise<T> {
    let postData, requestOptions;

    if (options) {
      const { data, ...rest } = options!;

      postData = data;
      requestOptions = rest;
    }

    return (await Axios.post(endpoint, postData, requestOptions)).data as T;
  }
  /**
   * Makes a GET request
   *
   * @param endpoint
   * @param options
   */
  async delete<T>(endpoint: string, options?: AxiosRequestConfig | null): Promise<T> {
    return (await Axios.delete(endpoint, options || {})).data as T;
  }
  /**
   * Makes a POST request to a service with service token
   *
   * @param endpoint
   * @param options
   */
  async postWithRequestToken<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    const token = await this.configOptions.getRequestToken(); // Get service token from authenticator
    const opts = this.prepareRequest(options!, token);
    return await this.post(endpoint, opts);
  }
  /**
   * Makes a GET request to a service with service token
   *
   * @param endpoint
   * @param options
   */
  async getWithRequestToken<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    const token = await this.configOptions.getRequestToken(); // Get service token from authenticator
    const opts = this.prepareRequest(options!, token);
    return await this.get(endpoint, opts);
  }
  /**
   * Makes a GET request to a service with service token
   *
   * @param endpoint
   * @param options
   */
  async deleteWithRequestToken<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    const token = await this.configOptions.getRequestToken(); // Get service token from authenticator
    const opts = this.prepareRequest(options!, token);
    return await this.delete(endpoint, opts);
  }
}
