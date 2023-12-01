from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2.5)

    @task
    def get_all_accidents(self):
        self.client.get("/accident/")

    @task
    def get_accident_by_department(self):
        self.client.get("/accident/department/75")

    @task
    def get_accident_count_by_department(self):
        self.client.get("/accident/count/department/75")

    @task
    def get_accident_count_by_year_range(self):
        self.client.get("/accident/count/year-range/2019/2021")

    @task
    def get_accident_count_by_year_range_and_department(self):
        self.client.get("/accident/count/year-range/2019/2021/department/75")

    @task
    def get_accident_by_data_criteria(self):
        self.client.get("/accident/criteria?dep=75")

    @task
    def get_accident_count_by_unique_values(self):
        self.client.get("/accident/count/unique-values/grav")

    @task
    def get_accident_count_by_unique_values_and_condition(self):
        self.client.get("/accident/count/unique-values/grav/dep/75")
