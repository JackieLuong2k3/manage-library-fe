const BASE_URL = "http://localhost:5678/api"
// const BASE_URL = "https://manage-library-be.onrender.com/api"


export class Endpoints {
  static readonly Auth = {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    CHANGE_PASSWORD_FIRST_TIME: `${BASE_URL}/auth/change-password-first-time`,
    VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email?token=${token}`,
  }
  static readonly Fine = {
    GET_ALL: `${BASE_URL}/fines`,
    GET_BY_ID: (id: string) => `${BASE_URL}/fines/${id}`,
    CREATE: `${BASE_URL}/fines`,
    UPDATE: (id: string) => `${BASE_URL}/fines/${id}`,
    DELETE: (id: string) => `${BASE_URL}/fines/${id}`,
    PATCH: (id: string) => `${BASE_URL}/fines/${id}/pay`,
    GET_BY_USER: `${BASE_URL}/fines/me`,
  }
  static readonly Review = {
    CREATE: `${BASE_URL}/reviews`,      
    GET_BY_USER_BY_BOOK_ID: (id: string) => `${BASE_URL}/reviews/book/${id}/user`,  
    GET_ALL: (id: string) => `${BASE_URL}/reviews/book/${id}`,
    UPDATE: (id: string) => `${BASE_URL}/reviews/${id}`,
    DELETE: (id: string) => `${BASE_URL}/reviews/${id}`,
  }
  static readonly Users = {
    GET_ALL: `${BASE_URL}/users`,
    GET_ALLV2: `${BASE_URL}/borrow-records/not-returned`,
    GET_BY_ID: (id: string) => `${BASE_URL}/users/${id}`,
    CREATE: `${BASE_URL}/users`,
    UPDATE: (id: string) => `${BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${BASE_URL}/users/${id}`,
  }
  static readonly Books = {
    GET_ALL: `${BASE_URL}/books`,
    GET_ALL_V2: `${BASE_URL}/books/v2`,
    GET_BY_ID: (id: string) => `${BASE_URL}/books/${id}`,
    CREATE: `${BASE_URL}/books`,
    UPDATE: (id: string) => `${BASE_URL}/books/${id}`,
    DELETE: (id: string) => `${BASE_URL}/books/${id}`,
  }
  static readonly Categories = {
    GET_ALL: `${BASE_URL}/categories`,
    GET_BY_ID: (id: string) => `${BASE_URL}/categories/${id}`,
    CREATE: `${BASE_URL}/categories`,
    UPDATE: (id: string) => `${BASE_URL}/categories/${id}`,
    DELETE: (id: string) => `${BASE_URL}/categories/${id}`,
  }
  static readonly BorrowRequest = {
    GET_ALL: `${BASE_URL}/borrow-requests`,
    GET_BY_ID: (id: string) => `${BASE_URL}/borrow-requests/${id}`,
    CREATE: `${BASE_URL}/borrow-requests`,
    UPDATE: (id: string) => `${BASE_URL}/borrow-requests/${id}`,
    DELETE: (id: string) => `${BASE_URL}/borrow-requests/${id}`,
    GET_MY_REQUESTS: `${BASE_URL}/borrow-requests/my-requests`,
    APPROVE: (id: string) => `${BASE_URL}/borrow-requests/${id}/approve`,
    REJECT: (id: string) => `${BASE_URL}/borrow-requests/${id}/reject`,
  }
  static readonly BorrowRecord = {
    GET_ALL: `${BASE_URL}/borrow-records`,
    GET_BY_ID: (id: string) => `${BASE_URL}/borrow-records/${id}`,
    CREATE: `${BASE_URL}/borrow-records`,
    UPDATE: (id: string) => `${BASE_URL}/borrow-records/${id}`,
    DELETE: (id: string) => `${BASE_URL}/borrow-records/${id}`,
    GET_MY_RECORDS: `${BASE_URL}/borrow-records/my-records`,
    RETURN_BOOK: (id: string) => `${BASE_URL}/borrow-records/${id}/return`,
    GET_BY_BOOK_ID: (bookId: string) => `${BASE_URL}/borrow-records/book/${bookId}`,
  }
}
