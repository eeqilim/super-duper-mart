package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.OrderItemDao;
import shopping.dto.PopularProductDto;
import shopping.dto.ProductProfitDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminStatsService {

    private final OrderItemDao orderItemDao;

    public AdminStatsService(OrderItemDao orderItemDao) {
        this.orderItemDao = orderItemDao;
    }

    @Transactional(readOnly = true)
    public List<PopularProductDto> getMostPopularProduct(int limit) {
        return orderItemDao.findPopularProducts(limit).stream()
                .map(row -> new PopularProductDto(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        ((Number) row[2]).longValue()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductProfitDto> getMostProfitableProduct(int limit) {
        return orderItemDao.findProfitableProducts(limit).stream()
                .map(row -> new ProductProfitDto(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        ((Number) row[2]).doubleValue()
                ))
                .collect(Collectors.toList());
    }
}
