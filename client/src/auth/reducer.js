export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
    case "AUTHLOADING":
      return {
        ...state,
        authloading: true,
      };
    case "LOGIN":
    case "REGISTER":
    case "LOAD":
      return {
        isAuthenticated: true,
        authloading: false,
        user: action.payload,
      };
    case "LOGOUT":
    case "FAIL":
      return {
        authloading: false,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
