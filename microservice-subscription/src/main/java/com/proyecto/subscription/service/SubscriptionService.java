package com.proyecto.subscription.service;

import com.proyecto.subscription.client.http.response.SubscriptionsWithCoursesResponse;
import com.proyecto.subscription.entity.Subscription;

import java.util.List;

public interface SubscriptionService {

    List<Subscription> findAll();

    Subscription findById(Long id);

    Subscription save(Subscription subscription);

    Subscription update(Subscription subscription);

    void delete(Long id);

    List<Subscription> findByCourseId(Long courseId);

    List<Subscription> findByUserId(Long userId);

    List<SubscriptionsWithCoursesResponse> findAllByUserIdWithCourseCreator(Long userId);
}
