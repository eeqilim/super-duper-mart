package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.OrderItemDao;
import shopping.dto.ProductProfitDto;
import shopping.dto.ProductSalesDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminStatsService {

    private final OrderItemDao orderItemDao;

    public AdminStatsService(OrderItemDao orderItemDao) {
        this.orderItemDao = orderItemDao;
    }

    public Long getTotalSoldItems() {
        Long result = orderItemDao.getTotalSoldItems();
        return result != null ? result : 0L;
    }

    public List<ProductSalesDto> getTop3SoldProducts() {
        return orderItemDao.getTop3SoldProducts()
                .stream()
                .map(row -> new ProductSalesDto(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        ((Number) row[2]).longValue()
                ))
                .collect(Collectors.toList());
    }

    public ProductProfitDto getMostProfitableProduct() {
        Object[] row = orderItemDao.getMostProfitableProduct();
        if (row == null) return null;
        return new ProductProfitDto(
                ((Number) row[0]).longValue(),
                (String) row[1],
                ((Number) row[2]).doubleValue()
        );
    }
}
