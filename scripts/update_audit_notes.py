import os

audit_dir = "c:/Users/Анна/Documents/Muse-tailwind/tailwind-project/docs/audits"
note = "\n\n--- \n🔴 **Примечание ИИ-агента согласно Task 1:** Изменения в файлы страниц не вносились (запрещено заданием). Все найденные ошибки зафиксированы только в данном файле аудита."

for filename in os.listdir(audit_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(audit_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "Примечание ИИ-агента согласно Task 1" not in content:
            with open(filepath, "a", encoding="utf-8") as f:
                f.write(note)
            print(f"Updated audit: {filename}")
