# Authentification JWT avec Spring Boot et React  et Gestion des rôles



Ce projet démontre comment implémenter l'authentification stateless avec JWT dans une application web utilisant React pour le frontend, Spring Boot pour le backend, et PostgreSQL comme base de données. Il permet aux utilisateurs de se connecter en toute sécurité, d'obtenir des tokens JWT et d'interagir avec des routes API protégées.


## Structure et Architecture
![Model](https://github.com/user-attachments/assets/0fd3f3da-0aba-4b27-83f5-84ccce06e1d8)

## Technologies utilisées

- **Frontend** : React.js, Axios, Bootstrap
- **Backend** : Spring Boot, Spring Security, JWT
- **Base de données** : PostgreSQL
- **Authentification** : Tokens JWT stateless

## Configuration Back-end :

### Prérequis

- **Java 17**
- **Spring Security Mvc Ioc** (3.3.0 ou plus récent)
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

```xml
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
```

## Table des matières

- [Aperçu de JWT](#apercu-de-jwt)
- [Technologies utilisées](#technologies-utilisées)
- [Configuration du Backend](#configuration-du-backend)
- [Configuration du Frontend](#configuration-du-frontend)
- [Intégration de JWT avec Spring Boot](#intégration-de-jwt-avec-spring-boot)

## Aperçu du projet

Ce projet utilise l'authentification stateless avec des JSON Web Tokens (JWT) pour sécuriser les requêtes API. Le frontend, construit avec React, interagit avec le backend implémenté en Spring Boot, où des tokens JWT sont utilisés pour authentifier les utilisateurs et protéger les routes. PostgreSQL est utilisé pour stocker les données utilisateur, y compris les noms d'utilisateur, les emails et les mots de passe chiffrés.

<img width="877" alt="Capture d'écran 2024-12-29 154451" src="https://github.com/user-attachments/assets/37172c39-bf95-43e6-87e6-8002954505f4" />

## Aperçu de JWT

Un JWT (JSON Web Token) se compose généralement de trois parties séparées par des points (`.`) :
1. **En-tête** : Contient le type de token (`JWT`) et l'algorithme de signature utilisé (par exemple, HMAC SHA256).
2. **Payload** : Contient les revendications de l'utilisateur (ID utilisateur, rôles, etc.), ainsi que des métadonnées comme l'émetteur du JWT, la date d'émission et la date d'expiration.
3. **Signature** (facultatif) : Une partie hachée générée avec la clé secrète, utilisée pour vérifier l'intégrité du token.

**Calcul de la signature JWT** :

<img width="559" alt="Capture d'écran 2024-12-29 155135" src="https://github.com/user-attachments/assets/5d6e968c-c1ce-4271-98e3-6bcefd84677c" />

## Exemple d'authentification d'un client :
le access-token est le jeton pour s'authentifier et se connecter .
le refresh-token est le 2 ème jeton qui permet d'obtenir un nouveau access-token après sa experation .

### Tokens encodés :

<img width="646" alt="Capture d'écran 2024-12-29 162618" src="https://github.com/user-attachments/assets/73f42138-f4be-4e48-93f0-8a9207b798d5" />

### Tokens decodés :

<img width="922" alt="Capture d'écran 2024-12-29 162801" src="https://github.com/user-attachments/assets/60b4c62a-52f6-46ce-8f72-4dd9ace01bf9" />

## Base De données 

<img width="885" alt="Capture d'écran 2024-12-29 164100" src="https://github.com/user-attachments/assets/c052960d-940c-4596-98fa-6301a9b66687" />



Après la création des compte des clients,Toutes les mots de passe seront hashées

<img width="479" alt="Capture d'écran 2024-12-29 164146" src="https://github.com/user-attachments/assets/5f918b1d-6154-4dfb-9d4e-084914767104" />



## Liste EndPoint 
![api_table_image](https://github.com/user-attachments/assets/6e6ce0a2-228d-4b72-8cb1-1a06c9514ee4)

## Demo

https://github.com/user-attachments/assets/e9a0cfe5-c77b-4708-9e92-bc6d6da1bf99
