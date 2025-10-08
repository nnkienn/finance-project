package com.finance.transaction.dto;

import java.util.List;

public record TimeseriesResponse(List<TimeseriesPoint> points) {}
