package shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Long orderId;
    private LocalDateTime datePlaced;
    private String orderStatus;
    private List<OrderItemDto> order;
}
