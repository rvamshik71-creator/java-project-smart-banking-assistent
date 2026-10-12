package com.mlrit.sba.repository;

import com.mlrit.sba.model.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findBySenderAccountOrReceiverAccountOrderByTransactionDateDesc(String sender, String receiver);
}
