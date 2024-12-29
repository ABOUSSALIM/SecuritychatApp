package myapplication.chatApp.entities;

public class UserRoleForm {
    private  String username ;
    private  String roleName ;


    public UserRoleForm(String username, String roleName) {
        this.username = username;
        this.roleName = roleName;
    }

    public UserRoleForm() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
