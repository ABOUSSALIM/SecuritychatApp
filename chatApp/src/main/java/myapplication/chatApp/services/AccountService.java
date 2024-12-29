package myapplication.chatApp.services;

import myapplication.chatApp.entities.AppRole;
import myapplication.chatApp.entities.AppUser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AccountService {

    AppUser addNewUser(AppUser appUser);
    AppRole addNewRole(AppRole appRole);
    void addRoleToUser(String username,String rolename);
    AppUser loadUserByUsername(String username);
    List<AppUser> listUsers();
    public boolean checkPassword(String rawPassword, String encodedPassword);

}
