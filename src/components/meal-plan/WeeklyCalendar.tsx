import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { WeeklyMealPlan } from '../../types/meal-plan';
import { DayColumn } from './DayColumn';
import { useMealPlanStore } from '../../store/meal-plan-store';

interface WeeklyCalendarProps {
  plan: WeeklyMealPlan;
}

export function WeeklyCalendar({ plan }: WeeklyCalendarProps) {
  const { swapMeals } = useMealPlanStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const allSlotIds = plan.days.flatMap(day => [
    `${day.date}-breakfast`,
    `${day.date}-dinner`,
  ]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [date1, meal1] = (active.id as string).split('-breakfast').length > 1
      ? [(active.id as string).replace('-breakfast', ''), 'breakfast' as const]
      : [(active.id as string).replace('-dinner', ''), 'dinner' as const];

    const [date2, meal2] = (over.id as string).split('-breakfast').length > 1
      ? [(over.id as string).replace('-breakfast', ''), 'breakfast' as const]
      : [(over.id as string).replace('-dinner', ''), 'dinner' as const];

    if (meal1 === meal2) {
      swapMeals(date1, meal1, date2, meal2);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allSlotIds} strategy={rectSortingStrategy}>
        {/* Desktop: 7-col grid / Tablet: 3-4 cols / Mobile: 1 col with horizontal scroll option */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3">
          {plan.days.map(day => (
            <DayColumn key={day.date} day={day} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
