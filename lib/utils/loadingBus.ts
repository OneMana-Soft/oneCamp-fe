type LoadingCallback = (isLoading: boolean) => void;

class LoadingBus {
    private listeners: LoadingCallback[] = [];
    private activeCount = 0;

    subscribe(callback: LoadingCallback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    start() {
        this.activeCount++;
        if (this.activeCount === 1) {
            this.notify(true);
        }
    }

    end() {
        this.activeCount = Math.max(0, this.activeCount - 1);
        if (this.activeCount === 0) {
            this.notify(false);
        }
    }

    private notify(isLoading: boolean) {
        this.listeners.forEach(l => l(isLoading));
    }
}

export const loadingBus = new LoadingBus();
