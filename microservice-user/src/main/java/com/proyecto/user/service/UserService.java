package com.proyecto.user.service;

import com.proyecto.user.client.http.response.AuthResponse;
import com.proyecto.user.client.http.response.CourseByUserResponse;
import com.proyecto.user.client.http.response.SubscriptionByUserResponse;
import com.proyecto.user.entity.User;

import java.util.List;

public interface UserService {

    List<User> findAll();

    User findById(Long id);

    User save(User user);

    User update(User user);

    void delete(Long id);

    SubscriptionByUserResponse findAllSubscriptionByUserId(Long userId);
    CourseByUserResponse findAllCourseByUserId(Long userId);
    AuthResponse findByEmailAndPassword(String email, String password);

    User findByEmail(String email);
}
