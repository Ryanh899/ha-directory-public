// creating custom axios for route auth
var myAxios = axios.create({
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  });
  myAxios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      if (error.response.status === 401) {
        // return authHelper.logOut("./sign-in.html");
      } else {
        return Promise.reject(error);
      }
    }
  );