import { useState, useEffect, useRef, useCallback } from 'react';
import type { Order, OrderStatus } from '../types/order';
import { orderService } from '@services/orders';

const STATUS_PROGRESSION: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const index = STATUS_PROGRESSION.indexOf(current);
  if (index === -1 || index === STATUS_PROGRESSION.length - 1) return null;
  return STATUS_PROGRESSION[index + 1];
}

interface UseOrderTrackingResult {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  // dev only — simulate next status
  simulateNextStatus: () => void;
}

export function useOrderTracking(orderId: string): UseOrderTrackingResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const fetchOrder = useCallback(async () => {
    try {
      const result = await orderService.getOrderById(orderId);
      if (!isMounted.current) return;
      if (result) {
        setOrder(result);
        setError(null);
      } else {
        setError('Order not found.');
      }
    } catch {
      if (!isMounted.current) return;
      setError('Could not load order. Check your connection.');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    isMounted.current = true;
    fetchOrder();

    // poll every 15 seconds
    // when socket.io is added in Phase 2, this gets replaced
    pollingRef.current = setInterval(() => {
      if (
        order?.status !== 'delivered' &&
        order?.status !== 'cancelled'
      ) {
        fetchOrder();
      }
    }, 15000);

    return () => {
      isMounted.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchOrder]);

  // stop polling when delivered or cancelled
  useEffect(() => {
    if (
      order?.status === 'delivered' ||
      order?.status === 'cancelled'
    ) {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [order?.status]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    fetchOrder();
  }, [fetchOrder]);

  // dev only — simulates status advancing so you can test the UI
  const simulateNextStatus = useCallback(() => {
    if (!order) return;
    const next = getNextStatus(order.status);
    if (!next) return;
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: next,
            statusHistory: [
              ...prev.statusHistory,
              {
                status: next,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : prev
    );
  }, [order]);

  return { order, isLoading, error, refresh, simulateNextStatus };
}