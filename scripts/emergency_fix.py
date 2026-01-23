
import os

try:
    filepath = os.path.join(os.getcwd(), 'src', 'input.css')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Ищем последнюю скобку
    content = content.strip()
    if content.endswith('}'):
        # Удаляем ПОСЛЕДНЮЮ скобку, которая лишняя
        new_content = content[:-1].strip()
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully removed the trailing brace.")
    else:
        print("No trailing brace found at the very end.")

except Exception as e:
    print(f"Error: {e}")
