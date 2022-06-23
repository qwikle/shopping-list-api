export default class Regex {
  public static password() {
      return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
  }

  public static code() {
      return /^[A-Z0-9]{6}$/
  }
    
}
