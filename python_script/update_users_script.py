import csv
import re

# Configuration
input_jmx_file = 'rps-load-test-scripts-backup-pythonscript.jmx'      # Your original JMX file
output_jmx_file = 'rps-load-test-scripts-backup-pythonscript-v2.jmx'  # The new file to save
csv_file_path = 'bdo_users.csv'

def replace_users_in_jmx():
    # Read the JMX file content
    try:
        with open(input_jmx_file, 'r', encoding='utf-8') as file:
            jmx_content = file.read()
    except FileNotFoundError:
        print(f"Error: Could not find {input_jmx_file}")
        return

    # Read the CSV and perform replacements
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
            # Assuming headers are: username,firstName,lastName
            reader = csv.DictReader(csvfile)
            
            count = 0
            for i, row in enumerate(reader, 1):
                # Construct the placeholder string (e.g., user001, user002... user100)
                # :03d ensures it pads with zeros to 3 digits
                placeholder = f"user{i:03d}" 
                
                real_username = row['username']
                
                if placeholder in jmx_content:
                    jmx_content = jmx_content.replace(placeholder, real_username)
                    count += 1
                    
            print(f"Success: Replaced {count} user placeholders.")

    except FileNotFoundError:
        print(f"Error: Could not find {csv_file_path}")
        return

    # Save the new JMX file
    with open(output_jmx_file, 'w', encoding='utf-8') as file:
        file.write(jmx_content)
    print(f"New JMX file saved as: {output_jmx_file}")

if __name__ == "__main__":
    replace_users_in_jmx()