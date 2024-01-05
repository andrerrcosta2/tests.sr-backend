
export const is2xxSuccessful = (statusCode: number): boolean => {
  return statusCode >= 200 && statusCode <= 299;
};

export const is3xxRedirection = (statusCode: number): boolean => {
  return statusCode >= 300 && statusCode <= 399;
};

export const is4xxClientError = (statusCode: number): boolean => {
  return statusCode >= 400 && statusCode <= 499;
};

export const is5xxServerError = (statusCode: number): boolean => {
  return statusCode >= 500 && statusCode <= 599;
};