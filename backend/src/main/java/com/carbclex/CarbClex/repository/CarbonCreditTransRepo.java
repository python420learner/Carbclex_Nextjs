package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.CarbonCreditTransaction;

public interface CarbonCreditTransRepo extends JpaRepository<CarbonCreditTransaction, Integer> {

}
