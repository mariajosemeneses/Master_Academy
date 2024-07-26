package com.proyecto.subscription.repository;

import com.proyecto.subscription.client.http.response.SubscriptionsWithCoursesResponse;
import com.proyecto.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findAllByCourseId(Long courseId);

    List<Subscription> findAllByUserId(Long userId);
}
