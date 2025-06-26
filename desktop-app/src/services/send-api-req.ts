import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig
} from "axios";

import useAuthStore from "../store/auth";
import { root } from './end-points';

type SendApiReqParams = Omit<AxiosRequestConfig, 'headers'> & {
  isAuthendicated?: boolean
  headers?: Record<string, string>
  isLocal?: boolean
}

type CustomError = Error & {
  status?: number
}

const requestIntercepter = (
  instance: AxiosInstance,
  isAuthendicated: boolean,
  headers: Record<string, string>,
  isLocal: boolean
): void => {
  instance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig) {
      const axiosHeaders = new AxiosHeaders(config.headers)

      if (isAuthendicated && !isLocal) {
        const token = useAuthStore.getState().token
        axiosHeaders.set('Authorization', `Bearer ${token}`)

        // Merge additional headers
        Object.entries(headers).forEach(([key, value]) => {
          axiosHeaders.set(key, value)
        })
      }

      config.headers = axiosHeaders
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
}

const responseIntercepter = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    error => {
      const err: CustomError = new Error(error?.message)
      err.status = error?.response?.status
      err.message = error?.response?.data?.message || error?.message
      if (err.status === 401) {
        useAuthStore.getState().clear()
      }
      throw err
    }
  )
}

const sendApiReq = ({
  isAuthendicated = true,
  headers = {},
  isLocal = false,
  ...others
}: SendApiReqParams): Promise<any> => {
  const instance = axios.create({
    baseURL: isLocal ? root.localBackendUrl : root.liveBackendUrl
  })

  requestIntercepter(instance, isAuthendicated, headers, isLocal)
  responseIntercepter(instance)

  return instance({ ...others })
}

export default sendApiReq