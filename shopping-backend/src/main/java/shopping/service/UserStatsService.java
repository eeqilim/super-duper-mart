package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.OrderItemDao;
import shopping.dto.PurchasedProductDto;
import shopping.entity.OrderItem;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserStatsService {

    private final OrderItemDao orderItemDao;

    public UserStatsService(OrderItemDao orderItemDao) {
        this.orderItemDao = orderItemDao;
    }

    @Transactional(readOnly = true)
    public List<PurchasedProductDto> getMostFrequentlyPurchasedProduct(Long userId, int limit) {
        return orderItemDao.findFrequentPurchasedProducts(userId, limit).stream()
                .map(row -> new PurchasedProductDto(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        (String) row[2],
                        ((Number) row[3]).intValue(),
                        ((Number) row[4]).doubleValue()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PurchasedProductDto> getMostRecentlyPurchasedProduct(Long userId, int limit) {
        return orderItemDao.findRecentPurchasedItems(userId, limit).stream()
                .map(this::toPurchasedProductDto)
                .collect(Collectors.toList());
    }

    private PurchasedProductDto toPurchasedProductDto(OrderItem oi) {
        return new PurchasedProductDto(
                oi.getProduct().getProductId(),
                oi.getProduct().getName(),
                oi.getProduct().getDescription(),
                oi.getQuantity(),
                oi.getPurchasedPrice()
        );
    }
}
