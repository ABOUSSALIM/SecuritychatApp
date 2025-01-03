
# ChatApp : Messagerie Instantanée et Partage en Temps Réel

### Authentification JWT avec Spring Boot/React et configuration des webSockets pour l'envoie et la reception des Messages



Le projet est une application web de messagerie en temps réel qui permet aux utilisateurs d'échanger des messages de manière fluide et sécurisée. Il utilise React pour le frontend, Spring Boot pour le backend, et PostgreSQL comme base de données. L'authentification des utilisateurs est gérée de manière stateless avec JSON Web Tokens (JWT), assurant ainsi une gestion sécurisée des sessions sans stockage d'état côté serveur.Les messages sont échangés en temps réel grâce à l'intégration des WebSockets et du protocole STOMP. Ce mécanisme permet une communication bidirectionnelle et asynchrone entre le client et le serveur, garantissant ainsi que les messages sont envoyés et reçus instantanément. Le backend, configuré avec Spring Boot et Spring WebSocket, gère les connexions WebSocket et les messages STOMP.


<img width="960" alt="Capture d'écran 2025-01-01 190103" src="https://github.com/user-attachments/assets/0899e2f0-fb68-4582-af5b-9ba22389ed5d" /> 





## Structure et Architecture
![Model](https://github.com/user-attachments/assets/0fd3f3da-0aba-4b27-83f5-84ccce06e1d8)

## Technologies utilisées

- **Frontend** : React.js, Axios,Stopmjs,Ws, Bootstrap
- **Backend** : Spring Boot, Spring Security, JWT
- **Base de données** : PostgreSQL
- **Authentification** : Tokens JWT stateless

## Configuration Back-end :

### Prérequis

- **Java 17**
- **Spring Security Mvc Ioc** 
- **PostgreSQL** installé localement

### Dépendances

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-jwt</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```



## Configuration Front-end :

```xml
npm install js-cookie axios  
```
### Stockage des Tokens dans React avec Cookies
Pour gérer les tokens côté client, nous utilisons :

**js-cookie :** Pour manipuler les cookies.
**axios :** Pour gérer les requêtes HTTP avec les tokens JWT.
**stomp :** Pour gérer les connexion instantanés des sockets.

```xml
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const Sock = new SockJS('http://localhost:8083/ws');
```


## Scénario Client/Application 

Ce projet utilise l'authentification stateless avec des JSON Web Tokens (JWT) pour sécuriser les requêtes API. Le frontend, construit avec React, interagit avec le backend implémenté en Spring Boot, où des tokens JWT sont utilisés pour authentifier les utilisateurs et protéger les routes. PostgreSQL est utilisé pour stocker les données utilisateur, y compris les noms d'utilisateur, les emails et les mots de passe chiffrés.

<img width="877" alt="Capture d'écran 2024-12-29 154451" src="https://github.com/user-attachments/assets/37172c39-bf95-43e6-87e6-8002954505f4" />

## Aperçu de JWT

Un JWT (JSON Web Token) se compose généralement de trois parties séparées par des points (`.`) :
1. **En-tête** : Contient le type de token (`JWT`) et l'algorithme de signature utilisé (par exemple, HMAC SHA256).
2. **Payload** : Contient les revendications de l'utilisateur (ID utilisateur, rôles, etc.), ainsi que des métadonnées comme l'émetteur du JWT, la date d'émission et la date d'expiration.
3. **Signature** (facultatif) : Une partie hachée générée avec la clé secrète, utilisée pour vérifier l'intégrité du token.

**Calcul de la signature JWT** :

<img width="559" alt="Capture d'écran 2024-12-29 155135" src="https://github.com/user-attachments/assets/5d6e968c-c1ce-4271-98e3-6bcefd84677c" />

## Exemple d'authentification :
le access-token est le jeton pour s'authentifier et se connecter .
le refresh-token est le 2 ème jeton qui permet d'obtenir un nouveau access-token après sa experation .

### Token encodé :

<img width="646" alt="Capture d'écran 2024-12-29 162618" src="https://github.com/user-attachments/assets/73f42138-f4be-4e48-93f0-8a9207b798d5" />

### Token decodé :

<img width="922" alt="Capture d'écran 2024-12-29 162801" src="https://github.com/user-attachments/assets/60b4c62a-52f6-46ce-8f72-4dd9ace01bf9" />


## Base De données PostgreSQL :

<img width="885" alt="Capture d'écran 2024-12-29 164100" src="https://github.com/user-attachments/assets/c052960d-940c-4596-98fa-6301a9b66687" />



**Après la création des compte des clients,Toutes les mots de passe seront hashées**

<img width="479" alt="Capture d'écran 2024-12-29 164146" src="https://github.com/user-attachments/assets/5f918b1d-6154-4dfb-9d4e-084914767104" />


# Configuration des webSockets 
## Dépendances a ajouter 
```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```
pour le Front-end :

```xml
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("http://localhost:3000/**").withSockJS();
}}
```
```xml
npm install stompjs   
```


# Dockerisation du Projet 
<img width="696" alt="Capture d'écran 2025-01-02 142928" src="https://github.com/user-attachments/assets/7c56f63a-745f-40c8-a6e4-fa76553c4241" />



## Liste EndPoint 
![api_table_image](https://github.com/user-attachments/assets/6e6ce0a2-228d-4b72-8cb1-1a06c9514ee4)
# Démo :

https://github.com/user-attachments/assets/c4767e5a-350e-47ec-aef5-53dbf3f84e69

<img width="143" alt="Capture d'écran 2025-01-01 194212" src="https://github.com/user-attachments/assets/0547670a-b837-4a8a-abe6-73ac272fa556" />

# Réalisé par :





**ABOUSSALIM OUSSAMA**



