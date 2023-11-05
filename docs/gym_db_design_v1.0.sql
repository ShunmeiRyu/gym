--创建TRIGGER
CREATE OR REPLACE FUNCTION updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 追加TRIGGER到指定列模版

--汎用型GENDER
CREATE TYPE GENDER AS ENUM (
  '0', -- 男性
  '1', -- 女性
  '8', -- その他
  '9'  -- 表示しない
);

CREATE TYPE STORES_STATUS AS ENUM (
  '1', -- 営業中
  '2', -- 休業中
  '9'  -- 一時停止中
);

CREATE TYPE STAFFS_STATUS AS ENUM (
  '0', -- 新规
  '1', -- 常规
  '7', -- 休憩
  '8', -- 無効
  '9'  -- 禁止
);

CREATE TYPE USERS_STATUS AS ENUM (
  '0', -- 未认证
  '1', -- 新规
  '2', -- 常规
  '8', -- 停用
  '9'  -- 禁用
);

CREATE TYPE SCHEDELES_STATUS AS ENUM (
  '0', -- 予約済み
  '1' -- 無予約
);

CREATE TYPE COACHS_STATUS AS ENUM (
  '0', -- 新規
  '1', -- 普通
  
  '7', -- 休憩
  '8', -- 無効
  '9'  -- 禁止
);


CREATE TYPE EQUIPMENT_STATUS AS ENUM (
  '1', -- 通常動作
  '2', -- 保守中
  '9'  -- 故障
);

CREATE TYPE RELATIONSHIP_STATUS AS ENUM (
  '0', -- 無効
  '1' -- 有効
);

--スーパー管理者
CREATE TABLE admins (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    gender GENDER NOT NULL,
    address varchar(255) NOT NULL,
    hashed_pwd varchar(255) NOT NULL,
    is_super bool NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();


--トレーナーとストア関係
CREATE TABLE coach_store_relationship (
    coach_id uuid NOT NULL,
    store_id uuid NOT NULL,
    status RELATIONSHIP_STATUS NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (coach_id, store_id)
);
CREATE TRIGGER update_coach_store_relationship_updated_at BEFORE UPDATE ON coach_store_relationship FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--トレーナー
CREATE TABLE coachs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email varchar(255) NOT NULL,
    hashed_pwd varchar(255) NOT NULL,
    last_name_kanji varchar(255) NOT NULL,
    last_name_kana varchar(255) NOT NULL,
    first_name_kanji varchar(255) NOT NULL,
    first_name_kana varchar(255) NOT NULL,
    post_code char(8) NOT NULL,
    addr_prefecture varchar(255) NOT NULL,
    addr_city_town_cunty varchar(255) NOT NULL,
    addr_dtl varchar(255) NOT NULL,
    addtl_addr varchar(255) NOT NULL,
    gender GENDER NOT NULL ,
    phone_num varchar(14) NOT NULL,
    birth_date date NOT NULL,
    status COACHS_STATUS NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_coachs_at BEFORE UPDATE ON coachs FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--設備
CREATE TABLE equipment (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    status EQUIPMENT_STATUS NOT NULL,
    info varchar(255) NOT NULL,
    store_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_equipment_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--課程
CREATE TABLE fitness_classes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    store_id uuid NOT NULL,
    coach_id uuid NOT NULL,
    room char(4) NOT NULL,
    start_date date NOT NULL,
    end_time date NOT NULL,
    period_max int2 NOT NULL,
    introduce varchar,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_fitness_classes_at BEFORE UPDATE ON fitness_classes FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--スケジュール
CREATE TABLE schedule (
    class_id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    date date NOT NULL,
    time_start date NOT NULL,
    time_end date NOT NULL,
    status SCHEDELES_STATUS NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, user_id)
);
CREATE TRIGGER update_schedule_at BEFORE UPDATE ON schedule FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--スタッフ
CREATE TABLE staffs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email varchar(255) NOT NULL,
    hashed_pwd varchar(255) NOT NULL,
    last_name_kanji varchar(255) NOT NULL,
    last_name_kana varchar(255) NOT NULL,
    first_name_kanji varchar(255) NOT NULL,
    first_name_kana varchar(255) NOT NULL,
    gender GENDER NOT NULL DEFAULT '0',
    post_code char(8) NOT NULL,
    addr_prefecture varchar(255) NOT NULL,
    addr_city_town_cunty varchar(255) NOT NULL,
    addr_dtl varchar(255) NOT NULL,
    addtl_addr varchar(255) NOT NULL,
    birth_date date NOT NULL,
    phone_num varchar(14) NOT NULL,
    store_id uuid NOT NULL,
    department varchar(128) NOT NULL,
    position varchar(128) NOT NULL,
    status STAFFS_STATUS NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_staffs_at BEFORE UPDATE ON staffs FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--ストア
CREATE TABLE stores (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    admin_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    business varchar(255) NOT NULL,
    status char NOT NULL,
    contact varchar(255) NOT NULL,
    homepage varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_stores_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();


CREATE TABLE access_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  access_token varchar(512) NOT NULL,
  is_valid bool NOT NULL DEFAULT True,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
CREATE TRIGGER update_access_tokens_at BEFORE UPDATE ON access_tokens FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

CREATE TABLE verify_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  verify_code varchar(6) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
CREATE TRIGGER update_verify_codes_at BEFORE UPDATE ON verify_codes FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();


--ユーザー情報
CREATE TABLE user_infos (
    user_id uuid NOT NULL DEFAULT gen_random_uuid(),
    last_name_kanji varchar(255) NOT NULL,
    last_name_kana varchar(255) NOT NULL,
    first_name_kanji varchar(255) NOT NULL,
    first_name_kana varchar(255) NOT NULL,
    gender GENDER NOT NULL DEFAULT '0',
    post_code char(8) NOT NULL,
    addr_prefecture varchar(255) NOT NULL,
    addr_city_town_cunty varchar(255) NOT NULL,
    addr_dtl varchar(255) NOT NULL,
    addtl_addr varchar(255) NOT NULL,
    birth_date date NOT NULL,
    member_type char(1) NOT NULL,
    phone_num varchar(14) NOT NULL,
    store_id uuid,
    card_code varchar(255) NOT NULL,
    card_exp varchar(5) NOT NULL,
    card_security_code varchar(255) NOT NULL,
    subscription bool NOT NULL DEFAULT 'true',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);
CREATE TRIGGER update_user_info_at BEFORE UPDATE ON user_infos FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

--ユーザー
CREATE TABLE users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email varchar(255) NOT NULL,
    hashed_pwd varchar(255) NOT NULL,
    status USERS_STATUS NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TRIGGER update_users_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE  updated_at_column();

ALTER TABLE coach_store_relationship ADD CONSTRAINT fk_coach_id FOREIGN KEY (coach_id) REFERENCES coachs (id);
ALTER TABLE coach_store_relationship ADD CONSTRAINT fk_store_id FOREIGN KEY (store_id) REFERENCES stores (id);
ALTER TABLE equipment ADD CONSTRAINT fk_store_id FOREIGN KEY (store_id) REFERENCES stores (id);
ALTER TABLE fitness_classes ADD CONSTRAINT fk_store_id FOREIGN KEY (store_id) REFERENCES stores (id);
ALTER TABLE fitness_classes ADD CONSTRAINT fk_coach_id FOREIGN KEY (coach_id) REFERENCES coachs (id);
ALTER TABLE schedule ADD CONSTRAINT fk_class_id FOREIGN KEY (class_id) REFERENCES fitness_classes (id);
ALTER TABLE schedule ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE staffs ADD CONSTRAINT fk_store_id FOREIGN KEY (store_id) REFERENCES stores (id);
ALTER TABLE stores ADD CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES admins (id);
ALTER TABLE user_infos ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE access_tokens ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE verify_codes ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);