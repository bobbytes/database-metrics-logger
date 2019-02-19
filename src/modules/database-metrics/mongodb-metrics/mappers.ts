export const mapServerStatus = (serverStatus: any): any => {
  const { connections, extra_info, globalLock, opcounters } = serverStatus;
  return { connections, extra_info, globalLock, opcounters };
};
