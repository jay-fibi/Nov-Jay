"""Demo 4: In-memory to-do list manager using a class."""


class TodoList:
    def __init__(self):
        self.tasks = []

    def add(self, title):
        self.tasks.append({"title": title, "done": False})

    def complete(self, index):
        if 0 <= index < len(self.tasks):
            self.tasks[index]["done"] = True
        else:
            raise IndexError("Task index out of range")

    def remove(self, index):
        return self.tasks.pop(index)

    def show(self):
        if not self.tasks:
            print("No tasks.")
        for i, task in enumerate(self.tasks):
            status = "x" if task["done"] else " "
            print(f"{i}. [{status}] {task['title']}")


def main():
    todo = TodoList()
    todo.add("Learn Python")
    todo.add("Write demo programs")
    todo.add("Push to GitHub")
    todo.complete(0)
    todo.show()
    removed = todo.remove(1)
    print(f"Removed: {removed['title']}")
    todo.show()


if __name__ == "__main__":
    main()
