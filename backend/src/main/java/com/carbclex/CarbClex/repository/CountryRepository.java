package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.carbclex.CarbClex.model.CountryCodeMaster;

@Repository
public interface CountryRepository extends JpaRepository<CountryCodeMaster,Integer> {

}
