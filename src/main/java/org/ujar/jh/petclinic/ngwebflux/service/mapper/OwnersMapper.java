package org.ujar.jh.petclinic.ngwebflux.service.mapper;

import org.mapstruct.*;
import org.ujar.jh.petclinic.ngwebflux.domain.Owners;
import org.ujar.jh.petclinic.ngwebflux.service.dto.OwnersDTO;

/**
 * Mapper for the entity {@link Owners} and its DTO {@link OwnersDTO}.
 */
@Mapper(componentModel = "spring")
public interface OwnersMapper extends EntityMapper<OwnersDTO, Owners> {}
