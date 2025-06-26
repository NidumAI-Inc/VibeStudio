import sendApiReq from "@/services/send-api-req";

export function getDomain(domain: string) {
  return sendApiReq({
    isLocal: true,
    url: `/frpc?domain=${domain}`,
  })
}

export function createDomain(data: { domain: string, user_id: string }) {
  return sendApiReq({
    isLocal: true,
    url: `/frpc`,
    method: "post",
    data,
  })
}

export function createFile(data: { domain: string, port: number }) {
  return sendApiReq({
    isLocal: true,
    method: "post",
    url: "/frpc/create-file",
    data,
  })
}

export function deleteDomain(data: any) {
  return sendApiReq({
    isLocal: true,
    method: "delete",
    url: "/frpc",
    data,
  })
}

export function start(data: { domain: string, port: number, vmId: string, id: string }) {
  return sendApiReq({
    isLocal: true,
    url: "/frpc/start",
    method: "post",
    data,
  })
}

export function stop(data: { vmId: string, id: string }) {
  return sendApiReq({
    isLocal: true,
    url: "/frpc/stop",
    method: "post",
  })
}
