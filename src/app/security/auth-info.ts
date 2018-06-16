export class AuthInfo {

  constructor(public $uid:string) {  }

  isLoggedIn() {
    return !!this.$uid;
  }

  getUsername(){
    return this.$uid;
  }

}
