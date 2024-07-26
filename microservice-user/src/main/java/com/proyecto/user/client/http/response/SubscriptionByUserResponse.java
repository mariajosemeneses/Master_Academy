package com.proyecto.user.client.http.response;

import com.proyecto.user.client.dto.SubscriptionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionByUserResponse {

    private String name;
    private String email;
    private String role;
    private List<SubscriptionDTO> subscriptionDTOList;

}
