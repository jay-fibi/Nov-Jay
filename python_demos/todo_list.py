"""Demo 4: In-memory to-do list manager using a class."""


class TodoList:
    def __init__(EVIEDEBUG_self):
        EVIEDEBUG_self.EVIEDEBUG_tasks = []

    def add(EVIEDEBUG_self, EVIEDEBUG_title):
        EVIEDEBUG_self.EVIEDEBUG_tasks.append({"title": EVIEDEBUG_title, "done": False})

    def complete(EVIEDEBUG_self, EVIEDEBUG_index):
        if 0 <= EVIEDEBUG_index < len(EVIEDEBUG_self.EVIEDEBUG_tasks):
            EVIEDEBUG_self.EVIEDEBUG_tasks[EVIEDEBUG_index]["done"] = True
        else:
            raise IndexError("Task index out of range")

    def remove(EVIEDEBUG_self, EVIEDEBUG_index):
        return EVIEDEBUG_self.EVIEDEBUG_tasks.pop(EVIEDEBUG_index)

    def show(EVIEDEBUG_self):
        if not EVIEDEBUG_self.EVIEDEBUG_tasks:
            print("No tasks.")
        for EVIEDEBUG_i, EVIEDEBUG_task in enumerate(EVIEDEBUG_self.EVIEDEBUG_tasks):
            EVIEDEBUG_status = "x" if EVIEDEBUG_task["done"] else " "
            print(f"{EVIEDEBUG_i}. [{EVIEDEBUG_status}] {EVIEDEBUG_task['title']}")


def main():
    EVIEDEBUG_todo = TodoList()
    EVIEDEBUG_todo.add("Learn Python")
    EVIEDEBUG_todo.add("Write demo programs")
    EVIEDEBUG_todo.add("Push to GitHub")
    EVIEDEBUG_todo.complete(0)
    EVIEDEBUG_todo.show()
    EVIEDEBUG_removed = EVIEDEBUG_todo.remove(1)
    print(f"Removed: {EVIEDEBUG_removed['title']}")
    EVIEDEBUG_todo.show()


if __name__ == "__main__":
    main()
