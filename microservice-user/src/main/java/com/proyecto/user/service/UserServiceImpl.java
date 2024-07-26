package com.proyecto.user.service;

import com.proyecto.user.client.CourseClient;
import com.proyecto.user.client.SubscriptionClient;
import com.proyecto.user.client.dto.CourseDTO;
import com.proyecto.user.client.dto.SubscriptionDTO;
import com.proyecto.user.client.http.response.AuthResponse;
import com.proyecto.user.client.http.response.CourseByUserResponse;
import com.proyecto.user.client.http.response.SubscriptionByUserResponse;
import com.proyecto.user.entity.User;
import com.proyecto.user.jwt.JwtService;
import com.proyecto.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service

public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionClient subscriptionClient;
    @Autowired
    private CourseClient courseClient;

    private final JwtService jwtService;

    public UserServiceImpl(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(StandardCharsets.UTF_8));

            // Convertir el hash a una representación hexadecimal
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al calcular el hash SHA-256", e);
        }
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @Override
    public User save(User user) {
        user.setPassword(hashPassword(user.getPassword()));
        if (user.getRole().equals("CREADOR")){
            user.setStatus("PENDIENTE");
        }else {
            user.setStatus("REGISTRADO");
        }

        return userRepository.save(user);
    }

    @Override
    public User update(User user) {
        User userOld = userRepository.findById(user.getId()).orElse(null);

        if (userOld != null) {
            if (user.getName() != null) {
                userOld.setName(user.getName());
            }
            if (user.getEmail() != null) {
                userOld.setEmail(user.getEmail());
            }
            if (user.getPassword() != null) {
                userOld.setPassword(hashPassword(user.getPassword()));
            }
            if (user.getRole() != null) {
                userOld.setRole(user.getRole());
            }
            if (user.getStatus() != null) {
                userOld.setStatus(user.getStatus());
            }
            return userRepository.save(userOld);
        } else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public SubscriptionByUserResponse findAllSubscriptionByUserId(Long userId) {
        // Consultar usuario
        User user = userRepository.findById(userId).orElse(new User());

        // Obtener subscriptions
        List<SubscriptionDTO> subscriptionDTOList = subscriptionClient.findAllSubscriptionByUserId(userId);
        return SubscriptionByUserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .subscriptionDTOList(subscriptionDTOList)
                .build();
    }

    @Override
    public CourseByUserResponse findAllCourseByUserId(Long userId) {
        // Consultar usuario
        User user = userRepository.findById(userId).orElse(new User());

        // Obtener subscriptions
        List<CourseDTO> courseDTOList = courseClient.findAllCoursesByUser(userId);
        return CourseByUserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .courseDTOList(courseDTOList)
                .build();
    }

    @Override
    public AuthResponse findByEmailAndPassword(String email, String password) {
        User user = userRepository.findByEmail(email);
        System.out.println(email + ":" + password);
        if (user != null && user.getPassword().equals(hashPassword(password))) {

            String token=jwtService.getToken(user);
            return AuthResponse.builder()
                    .token(token)
                    .build();

        }
        return null;
    }

    @Override
    public User findByEmail(String email) {
        User aux = userRepository.findByEmail(email);
        aux.setPassword("");
        return aux;
    }
}
