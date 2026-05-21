export type TimeRange<T> = {
    start: number; // minutes since midnight
    end: number;   // minutes since midnight
    value: T;
};

export type TimeRangeEntry<T> = [string, string, T];

export class TimeBasedValue<T> {
    private ranges: TimeRange<T>[] = [];

    constructor(ranges: TimeRangeEntry<T>[]) {
        this.ranges = ranges.map(r => ({
            start: this.timeToMinutes(r[0]),
            end: this.timeToMinutes(r[1]),
            value: r[2]
        }));
        this.ranges.sort((a, b) => a.start - b.start);
    }

    addRange(startTime: string, endTime: string, value: T): void {
        this.ranges.push({
            start: this.timeToMinutes(startTime),
            end: this.timeToMinutes(endTime),
            value
        });
        this.ranges.sort((a, b) => a.start - b.start);
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    getValue(hour: number, minute: number): T | undefined {
        const minutes = hour * 60 + minute;

        const range = this.ranges.find(r => 
            minutes >= r.start && minutes < r.end
        );

        return range?.value;
    }

    toGtfsFrequency(): [string, string, T][] {
        return this.ranges.map(r => [
            `${this.minutesToTime(r.start)}:00`,
            `${this.minutesToTime(r.end)}:00`,
            r.value
        ]);
    }
}
