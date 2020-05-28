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
      console.log(error)
      // if (error.response.status === 401) {
      //   return window.location.assign('error.html')
      // } else {
      //   return window.location.assign('error.html')
      // }
    }
  );