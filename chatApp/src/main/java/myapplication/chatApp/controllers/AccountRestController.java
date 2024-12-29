package myapplication.chatApp.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import myapplication.chatApp.config.ConfigConst;
import myapplication.chatApp.entities.AppRole;
import myapplication.chatApp.entities.AppUser;
import myapplication.chatApp.entities.UserLoginForm;
import myapplication.chatApp.entities.UserRoleForm;
import myapplication.chatApp.services.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "/api")
public class AccountRestController {


    private AccountService accountService; // Injecte le service de gestion de compte

    public AccountRestController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping(path = "/users")
    public List<AppUser> appUsers() {
        return accountService.listUsers(); // Retourne la liste des utilisateurs
    }

    // Méthode pour ajouter un nouvel utilisateur
    @PostMapping(path = "/addUser")
    public AppUser saveUser(@RequestBody AppUser appUser) {
        return accountService.addNewUser(appUser); // Ajoute un nouvel utilisateur et le retourne
    }

    // Méthode pour ajouter un nouveau rôle
    @PostMapping(path = "/addRole")
    public AppRole saveRole(@RequestBody AppRole appRole) {
        return accountService.addNewRole(appRole); // Ajoute un nouveau rôle et le retourne
    }

    // Méthode pour attribuer un rôle à un utilisateur
    @PostMapping(path = "/addRoleToUser")
    public void addRoleToUser(@RequestBody UserRoleForm userRoleForm) {
        accountService.addRoleToUser(userRoleForm.getUsername(), userRoleForm.getRoleName()); // Attribue le rôle à l'utilisateur
    }


    // Méthode pour rafraîchir le token
    @GetMapping(path = "/refreshToken")
    public void refresh(HttpServletRequest request, HttpServletResponse response)throws Exception {
        String authToken = request.getHeader(ConfigConst.AUTH_HEADER); // Récupère le token d'autorisation
    if(authToken!=null && authToken.startsWith(ConfigConst.PREFIX)){
        try {
            String jwt = authToken.substring(ConfigConst.PREFIX.length());
            Algorithm algorithm = Algorithm.HMAC256(ConfigConst.SECRET);
            JWTVerifier jwtVerifier = JWT.require(algorithm).build();
            DecodedJWT decodedJWT = jwtVerifier.verify(jwt);
            String username = decodedJWT.getSubject();
            AppUser appUser = accountService.loadUserByUsername(username);
            String jwtAccesToken = JWT.create()
                    .withSubject(appUser.getUsername())
                    .withExpiresAt(new Date(System.currentTimeMillis()+ConfigConst.EXPIRE_ACCESS_TOKEN))
                    .withIssuer(request.getRequestURL().toString())
                    .withClaim("roles",appUser.getAppRoles().stream().map(r->r.getRoleName()).collect(Collectors.toList()))
                    .sign(algorithm);

            Map<String,String> idToken = new HashMap<>();
            idToken.put("access-token",jwtAccesToken);
            idToken.put("refresh-token",jwt);
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(),idToken);



        } catch (Exception e) {
            throw e ;
        }
    }else {
        throw new RuntimeException("Refresh token required !!");
    }
    }
    @GetMapping(path = "/profile")
    public  AppUser profile(Principal principal) {
        return accountService.loadUserByUsername(principal.getName());
    }
        @PostMapping(path = "/login")
        public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginForm loginRequest) {
            try {
                AppUser appUser = accountService.loadUserByUsername(loginRequest.getUsername());

                // Vérifier si l'utilisateur existe et si le mot de passe est correct
                if (appUser != null && accountService.checkPassword(loginRequest.getPassword(), appUser.getPassword())) {
                    // Générer un JWT d'accès
                    Algorithm algorithm = Algorithm.HMAC256(ConfigConst.SECRET);
                    String jwtAccessToken = JWT.create()
                            .withSubject(appUser.getUsername())
                            .withExpiresAt(new Date(System.currentTimeMillis() + ConfigConst.EXPIRE_ACCESS_TOKEN))
                            .withIssuer("chatApp")
                            .withClaim("roles", appUser.getAppRoles().stream()
                                    .map(AppRole::getRoleName)
                                    .collect(Collectors.toList()))
                            .sign(algorithm);


                    String jwtRefreshToken = JWT.create()
                            .withSubject(appUser.getUsername())
                            .withExpiresAt(new Date(System.currentTimeMillis() + ConfigConst.EXPIRE_REFRESH_TOKEN))
                            .withIssuer("chatApp")
                            .sign(algorithm);


                    Map<String, String> tokens = new HashMap<>();
                    tokens.put("access-token", jwtAccessToken);
                    tokens.put("refresh-token", jwtRefreshToken);

                    return ResponseEntity.ok(tokens);

                } else {

                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Identifiants invalides"));
                }
            } catch (Exception e) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Une erreur est survenue lors de l'authentification"));
            }
        }



}

