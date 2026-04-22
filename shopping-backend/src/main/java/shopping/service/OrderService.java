package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.OrderDao;
import shopping.dao.ProductDao;
import shopping.dao.UserDao;
import shopping.dto.OrderDto;
import shopping.dto.OrderItemDto;
import shopping.dto.OrderItemRequest;
import shopping.exception.InvalidOrderStatusException;
import shopping.exception.NotEnoughInventoryException;
import shopping.exception.ResourceNotFoundException;
import shopping.entity.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderDao orderDao;
    private final ProductDao productDao;
    private final UserDao userDao;

    public OrderService(OrderDao orderDao, ProductDao productDao, UserDao userDao) {
        this.orderDao = orderDao;
        this.productDao = productDao;
        this.userDao = userDao;
    }

    public OrderDto placeOrder(Long userId, List<OrderItemRequest> itemRequests) {
        if (itemRequests == null || itemRequests.isEmpty()) {
            throw new IllegalArgumentException("No item found.");
        }

        User user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found" + userId));

        Order order = new Order();
        order.setUser(user);
        order.setDatePlaced(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PROCESSING);

        for (OrderItemRequest request : itemRequests) {
            if (request.getProductId() == null) {
                throw new IllegalArgumentException("Product id not found.");
            }

            if (request.getQuantity() == null || request.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than 0.");
            }

            Product product = productDao.findById(request.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.getProductId()));

            if (product.getQuantity() < request.getQuantity()) {
                throw new NotEnoughInventoryException("Not enough inventory for product: " + product.getName());
            }

            product.setQuantity(product.getQuantity() - request.getQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(request.getQuantity());
            orderItem.setPurchasedPrice(product.getRetailPrice());
            orderItem.setWholesalePrice(product.getWholesalePrice());
            order.addOrderItem(orderItem);
        }

        orderDao.save(order);
        return toOrderDto(order);
    }

    public OrderDto cancelOrder(Long orderId, Long userId) {
        Order order = orderDao.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new InvalidOrderStatusException("Completed order cannot be canceled.");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELED) {
            throw new InvalidOrderStatusException("Order is already canceled.");
        }

        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setQuantity(product.getQuantity() + orderItem.getQuantity());
        }

        order.setOrderStatus(OrderStatus.CANCELED);
        orderDao.save(order);
        return toOrderDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersByUserId(Long userId) {
        return orderDao.findByUserId(userId)
                .stream()
                .map(this::toOrderDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderDetail(Long orderId, Long userId) {
        Order order = orderDao.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        }

        return toOrderDto(order);
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
