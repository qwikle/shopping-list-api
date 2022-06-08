export default class Regex {
    public static password: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    public static alphanumeric: RegExp = /^[a-zA-Z0-9]{6}$/;
}