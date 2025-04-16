package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.carbclex.CarbClex.model.Verifier;

@Repository
public interface VerifierRepository extends JpaRepository<Verifier,Integer> {

}
