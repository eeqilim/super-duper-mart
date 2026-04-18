package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.OrderDao;
import shopping.dto.OrderDto;
import shopping.dto.OrderItemDto;
import shopping.exception.InvalidOrderStatusException;
import shopping.exception.ResourceNotFoundException;
import shopping.model.Order;
import shopping.model.OrderItem;
import shopping.model.OrderStatus;
import shopping.model.Product;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminOrderService {

    private final OrderDao orderDao;

    public AdminOrderService(OrderDao orderDao) {
        this.orderDao = orderDao;
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersForAdmin(int page, int size) {
        return orderDao.findAllForAdmin(page, size)
                .stream()
                .map(this::toOrderDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId) {
        Order order = orderDao.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return toOrderDto(order);
    }

    public OrderDto completeOrder(Long orderId) {
        Order order = orderDao.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getOrderStatus() == OrderStatus.CANCELED) {
            throw new InvalidOrderStatusException("Canceled orders cannot be completed.");
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new InvalidOrderStatusException("Order is already completed.");
        }

        order.setOrderStatus(OrderStatus.COMPLETED);
        Order updated = orderDao.save(order);
        return toOrderDto(updated);
    }

    public OrderDto cancelOrder(Long orderId) {
        Order order = orderDao.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new InvalidOrderStatusException("Completed orders cannot be canceled.");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELED) {
            throw new InvalidOrderStatusException("Order is already canceled.");
        }

        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setQuantity(product.getQuantity() + orderItem.getQuantity());
        }

        order.setOrderStatus(OrderStatus.CANCELED);
        Order updated = orderDao.save(order);
        return toOrderDto(updated);
    }

    private OrderDto toOrderDto(Order order) {
        List<OrderItemDto> items = order.getOrderItems()
                .stream()
                .map(this::toOrderItemDto)
                .collect(Collectors.toList());

        return new OrderDto(
                order.getOrderId(),
                order.getDatePlaced(),
                order.getOrderStatus().name(),
                items
        );
    }

    private OrderItemDto toOrderItemDto(OrderItem orderItem) {
        return new OrderItemDto(
                orderItem.getProduct().getProductId(),
                orderItem.getProduct().getName(),
                orderItem.getQuantity(),
                orderItem.getPurchasedPrice()
        );
    }
}
